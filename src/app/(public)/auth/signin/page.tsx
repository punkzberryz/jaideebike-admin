import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignInPage = () => {
  return (
    <MaxWidthWrapper>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/auth/signup">SignUp?</Link>
          {/* Social Sign-in Options */}
          <div className="flex gap-6">
            <Link
              href="/auth/signin/github"
              className={buttonVariants({
                size: "lg",
                className: "w-full",
                variant: "outline",
              })}
            >
              <FaGithub className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className={buttonVariants({
                size: "lg",
                className: "w-full",
                variant: "outline",
              })}
            >
              <FcGoogle className="h-5 w-5" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

export default SignInPage;
