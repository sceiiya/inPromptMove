import PostGig from "@/components/PostGig";

export default function CreateGig() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="mb-4 text-3xl font-bold">Create a New Gig</h1>
      <PostGig />
    </div>
  );
}