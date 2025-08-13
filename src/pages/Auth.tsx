import { useEffect, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [titleSet, setTitleSet] = useState(false);

  useEffect(() => {
    if (!titleSet) {
      document.title = "Sign in | Asphalt OverWatch OS";
      setTitleSet(true);
    }
  }, [titleSet]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-elevation">
        <CardHeader>
          <CardTitle className="text-center">Access your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4">
              <LoginForm onSwitchToSignup={() => {}} />
            </TabsContent>
            <TabsContent value="signup" className="pt-4">
              <SignupForm onSwitchToLogin={() => {}} />
            </TabsContent>
          </Tabs>
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
