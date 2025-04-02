
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Current password must be at least 6 characters' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password must be at least 6 characters' }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const SettingsPage = () => {
  const { userData } = useAuth();
  const { toast } = useToast();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: userData?.username || '',
      email: userData?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      setLoadingProfile(true);
      // This is where you would call an API to update the user profile
      console.log('Profile update data:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setLoadingPassword(true);
      // This is where you would call an API to update the password
      console.log('Password update data:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error',
        description: 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information and email settings.
              </CardDescription>
            </CardHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-inventory-primary hover:bg-inventory-secondary"
                    disabled={loadingProfile}
                  >
                    {loadingProfile ? (
                      <>
                        <span className="mr-2">Saving...</span>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and manage security preferences.
              </CardDescription>
            </CardHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter current password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter new password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm new password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-inventory-primary hover:bg-inventory-secondary"
                    disabled={loadingPassword}
                  >
                    {loadingPassword ? (
                      <>
                        <span className="mr-2">Updating...</span>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
