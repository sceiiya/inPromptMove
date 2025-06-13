module inPromptMove_addr::test_inPromptMove002 {
    use std::signer;
    use std::string::{ String};
    use std::vector;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::timestamp;
    use aptos_framework::account;

    // === Structs ===
    struct Gig has key, store {
        id: u64,
        title: String,
        description: String,
        bounty: u64,
        start_time: u64,
        end_time: u64,
        poster: address,
        is_active: bool,
        submissions: vector<Submission>,
    }

    struct Submission has store, copy, drop {
        id: u64,
        submitter: address,
        work_link: String,
        submission_time: u64,
    }

    struct GigStore has key {
        gigs: vector<Gig>,
        gig_counter: u64,
        submission_counter: u64,
        gig_created_events: EventHandle<GigCreatedEvent>,
        submission_made_events: EventHandle<SubmissionMadeEvent>,
        winner_selected_events: EventHandle<WinnerSelectedEvent>,
    }

    // === Events ===
    struct GigCreatedEvent has drop, store {
        gig_id: u64,
        title: String,
        poster: address,
        start_time: u64,
        end_time: u64,
        bounty: u64,
    }

    struct SubmissionMadeEvent has drop, store {
        gig_id: u64,
        submission_id: u64,
        submitter: address,
        work_link: String,
        submission_time: u64,
    }

    struct WinnerSelectedEvent has drop, store {
        gig_id: u64,
        submission_id: u64,
        winner: address,
        bounty: u64,
    }

    // === Errors ===
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_GIG_NOT_FOUND: u64 = 3;
    const E_NOT_POSTER: u64 = 4;
    const E_GIG_NOT_ACTIVE: u64 = 5;
    const E_SUBMISSION_NOT_FOUND: u64 = 6;
    const E_INVALID_TIME: u64 = 7;
    const E_POSTER_CANNOT_SUBMIT: u64 = 8;

    // === Functions ===
    public entry fun initialize(account: &signer) {
        let signer_addr = signer::address_of(account);
        assert!(!exists<GigStore>(signer_addr), E_ALREADY_INITIALIZED);
        move_to(account, GigStore {
            gigs: vector::empty(),
            gig_counter: 0,
            submission_counter: 0,
            gig_created_events: account::new_event_handle<GigCreatedEvent>(account),
            submission_made_events: account::new_event_handle<SubmissionMadeEvent>(account),
            winner_selected_events: account::new_event_handle<WinnerSelectedEvent>(account),
        });
    }

    public entry fun post_gig(
        account: &signer,
        title: String,
        description: String,
        bounty: u64,
        start_time: u64,
        end_time: u64
    ) acquires GigStore {
        let signer_addr = signer::address_of(account);
        assert!(exists<GigStore>(signer_addr), E_NOT_INITIALIZED);
        assert!(end_time > start_time && start_time >= timestamp::now_seconds(), E_INVALID_TIME);

        let gig_store = borrow_global_mut<GigStore>(signer_addr);
        let gig_id = gig_store.gig_counter;
        gig_store.gig_counter = gig_id + 1;

        let gig = Gig {
            id: gig_id,
            title,
            description,
            bounty,
            start_time,
            end_time,
            poster: signer_addr,
            is_active: true,
            submissions: vector::empty(),
        };
        vector::push_back(&mut gig_store.gigs, gig);

        event::emit_event(
            &mut gig_store.gig_created_events,
            GigCreatedEvent {
                gig_id,
                title,
                poster: signer_addr,
                start_time,
                end_time,
                bounty,
            },
        );
    }

    public entry fun submit_work(
        account: &signer,
        poster_addr: address,
        gig_id: u64,
        work_link: String
    ) acquires GigStore {
        let submitter_addr = signer::address_of(account);
        assert!(exists<GigStore>(poster_addr), E_NOT_INITIALIZED);
        assert!(submitter_addr != poster_addr, E_POSTER_CANNOT_SUBMIT);

        let gig_store = borrow_global_mut<GigStore>(poster_addr);
        let gig = find_gig_mut(&mut gig_store.gigs, gig_id);
        assert!(gig.is_active, E_GIG_NOT_ACTIVE);
        assert!(timestamp::now_seconds() >= gig.start_time && timestamp::now_seconds() <= gig.end_time, E_INVALID_TIME);

        let submission_id = gig_store.submission_counter;
        gig_store.submission_counter = submission_id + 1;

        let submission = Submission {
            id: submission_id,
            submitter: submitter_addr,
            work_link,
            submission_time: timestamp::now_seconds(),
        };
        vector::push_back(&mut gig.submissions, submission);

        event::emit_event(
            &mut gig_store.submission_made_events,
            SubmissionMadeEvent {
                gig_id,
                submission_id,
                submitter: submitter_addr,
                work_link,
                submission_time: timestamp::now_seconds(),
            },
        );
    }

    public entry fun select_winner(
        account: &signer,
        poster_addr: address,
        gig_id: u64,
        submission_id: u64
    ) acquires GigStore {
        let signer_addr = signer::address_of(account);
        assert!(exists<GigStore>(poster_addr), E_NOT_INITIALIZED);

        let gig_store = borrow_global_mut<GigStore>(poster_addr);
        let gig = find_gig_mut(&mut gig_store.gigs, gig_id);
        assert!(gig.poster == signer_addr, E_NOT_POSTER);
        assert!(gig.is_active, E_GIG_NOT_ACTIVE);
        assert!(timestamp::now_seconds() > gig.end_time, E_INVALID_TIME);

        let submission = find_submission(&gig.submissions, submission_id);
        gig.is_active = false;

        event::emit_event(
            &mut gig_store.winner_selected_events,
            WinnerSelectedEvent {
                gig_id,
                submission_id,
                winner: submission.submitter,
                bounty: gig.bounty,
            },
        );
    }

    fun find_gig_mut(gigs: &mut vector<Gig>, gig_id: u64): &mut Gig {
        let i = 0;
        let len = vector::length(gigs);
        while (i < len) {
            let gig = vector::borrow_mut(gigs, i);
            if (gig.id == gig_id) {
                return gig
            };
            i = i + 1;
        };
        abort E_GIG_NOT_FOUND
    }

    fun find_submission(submissions: &vector<Submission>, submission_id: u64): &Submission {
        let i = 0;
        let len = vector::length(submissions);
        while (i < len) {
            let submission = vector::borrow(submissions, i);
            if (submission.id == submission_id) {
                return submission
            };
            i = i + 1;
        };
        abort E_SUBMISSION_NOT_FOUND
    }

    #[view]
    public fun get_gig(poster_addr: address, gig_id: u64): (String, String, u64, u64, u64, address, bool, vector<Submission>) acquires GigStore {
        assert!(exists<GigStore>(poster_addr), E_NOT_INITIALIZED);
        let gig_store = borrow_global<GigStore>(poster_addr);
        let gig = vector::borrow(&gig_store.gigs, gig_id);
        (
            gig.title,
            gig.description,
            gig.bounty,
            gig.start_time,
            gig.end_time,
            gig.poster,
            gig.is_active,
            gig.submissions
        )
    }

    #[view]
    public fun get_gig_count(poster_addr: address): u64 acquires GigStore {
        assert!(exists<GigStore>(poster_addr), E_NOT_INITIALIZED);
        let gig_store = borrow_global<GigStore>(poster_addr);
        vector::length(&gig_store.gigs)
    }

}