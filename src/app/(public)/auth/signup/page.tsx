import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignUpForm from "./components/signup-form";
import Link from "next/link";
import { metadataHelper } from "@/lib/metadata";

const SignUpPage = async () => {
  return (
    <MaxWidthWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <Link href="/auth/signin">Sign In?</Link>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default SignUpPage;

export const metadata = metadataHelper({
  title: "Sign Up",
  description: "Sign up for an account.",
  keywords: ["sign up", "register"],
});
