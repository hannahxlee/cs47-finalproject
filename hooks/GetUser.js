import { useQuery } from "react-query";
import { supabase } from "../supabase";

// const getUser = async ({ userId }) => {
//   const { data, error } = await supabase
//     .from("users")
//     .select()
//     .eq("id", userId)
//     .single();

//   if (error) {
//     throw new Error(error.message);
//   }

//   if (!data) {
//     throw new Error("User not found");
//   }

//   return data;
// };

export const getUser = async () => {
  const user = supabase.auth.user();
  const { data: users, error } = await supabase
    .from("users")
    .select()
    .eq("username", user.username)
    .single();
  console.log("This is my username:", username);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("User not found");
  }

  return data;
};

export default function useUser() {
  const user = supabase.auth.user();
  return useQuery("user", () => getUser(user?.id));
}
