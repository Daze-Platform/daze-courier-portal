import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Upload, Eye, EyeOff } from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";
import ferdinandProfile from "@/assets/ferdinand-profile.jpg";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfileSettings = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(ferdinandProfile);
  
  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "Ferdinand",
      lastName: "S.",
      email: "ferdinand@resortdelivery.com",
      phoneNumber: "(555) 123-4567"
    }
  });

  const passwordForm = useForm<PasswordFormData>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image uploaded",
        description: "Profile image updated successfully"
      });
    }
  };

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log("Profile data:", data);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved"
    });
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Password updated");
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully"
    });
    passwordForm.reset();
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "This feature will be implemented soon",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileImage} alt="Profile" />
                  <AvatarFallback className="text-lg">FS</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button 
                        type="button" 
                        variant="secondary"
                        className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JPEG, PNG, or GIF and cannot exceed 10MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName", { required: true })}
                      placeholder="Enter first name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName", { required: true })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email", { required: true })}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...profileForm.register("phoneNumber", { required: true })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" className="sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="sm:w-auto">
                    Update
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      {...passwordForm.register("currentPassword", { required: true })}
                      placeholder="Enter current password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword", { required: true, minLength: 8 })}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword", { required: true })}
                    placeholder="Confirm new password"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Improve your security with a strong password
                </p>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" className="sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="sm:w-auto">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <div className="pt-4">
            <Button 
              variant="ghost" 
              onClick={handleDeleteAccount}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 p-0 h-auto font-normal"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;