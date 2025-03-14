import { supabase } from "../utils/supabase";
import { createContext, useContext, useState } from "react";

type SignUpForm = {
  fullName: string;
  email: string;
  password: string;
};

type SignUpContextProps = {
  form: SignUpForm;
  updateForm: (data: Partial<SignUpForm>) => void;
};

export const SignUpContext = createContext<SignUpContextProps>({} as SignUpContextProps);

export default function SignUpProvider({ children }: { children: JSX.Element[] }) {
  const [form, setForm] = useState<SignUpForm>({
    fullName: "",
    email: "",
    password: "",
  });

  function updateForm(data: Partial<SignUpForm>) {
    setForm({ ...form, ...data });
  }

  return <SignUpContext.Provider value={{ form, updateForm }}>{children}</SignUpContext.Provider>;
}
export const useSignUpForm = () => useContext(SignUpContext);
