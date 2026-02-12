import { supabase } from "@/app/lib/supabase";


export function getBookPublicUrl(filePath: string) {
  // Call .from(bucketName).getPublicUrl(filePath)
  const { data } = supabase.storage
    .from("books")          // your bucket name
    .getPublicUrl(filePath); // filename in storage

 

  return data.publicUrl; // returns the URL of your public PDF
}
