import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { SiteSetting } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Fetch all site settings
  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
  });

  // Prepare the form data when settings are loaded
  useEffect(() => {
    if (settings.length > 0 && Object.keys(formData).length === 0) {
      const initialFormData: Record<string, string> = {};
      settings.forEach(setting => {
        initialFormData[setting.settingKey] = setting.settingValue;
      });
      setFormData(initialFormData);
    }
  }, [settings, formData]);

  // Update site setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: string;
      value: string;
    }) => {
      const res = await apiRequest("PUT", `/api/site-settings/${key}`, {
        settingValue: value,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
      });
      setEditMode(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle input change
  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle save all changes
  const handleSaveChanges = async () => {
    // For each changed setting, send an update request
    for (const key of Object.keys(formData)) {
      const setting = settings.find(s => s.settingKey === key);
      // Only update if the value has changed
      if (setting && setting.settingValue !== formData[key]) {
        await updateSettingMutation.mutate({
          key,
          value: formData[key],
        });
      }
    }
  };

  // Group settings by category for better organization
  const contactSettings = settings.filter(s => 
    s.settingKey.startsWith('contact')
  );
  
  const socialSettings = settings.filter(s => 
    s.settingKey.includes('Url')
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Site Settings" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Website Settings</CardTitle>
          <CardDescription>
            Update your contact information and social media links
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)}>Edit Settings</Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveChanges}
                      disabled={updateSettingMutation.isPending}
                    >
                      {updateSettingMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <Tabs defaultValue="contact">
                <TabsList className="mb-4">
                  <TabsTrigger value="contact">Contact Information</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                  <div className="space-y-4">
                    {contactSettings.map(setting => (
                      <div key={setting.id}>
                        <Label htmlFor={setting.settingKey}>
                          {setting.settingKey === 'contactEmail'
                            ? 'Email Address'
                            : setting.settingKey === 'contactPhone'
                            ? 'Phone Number'
                            : 'Address'}
                        </Label>
                        <Input
                          id={setting.settingKey}
                          value={formData[setting.settingKey] || setting.settingValue}
                          onChange={e => handleInputChange(setting.settingKey, e.target.value)}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="social">
                  <div className="space-y-4">
                    {socialSettings.map(setting => (
                      <div key={setting.id}>
                        <Label htmlFor={setting.settingKey}>
                          {setting.settingKey === 'facebookUrl'
                            ? 'Facebook URL'
                            : setting.settingKey === 'instagramUrl'
                            ? 'Instagram URL'
                            : 'Twitter URL'}
                        </Label>
                        <Input
                          id={setting.settingKey}
                          value={formData[setting.settingKey] || setting.settingValue}
                          onChange={e => handleInputChange(setting.settingKey, e.target.value)}
                          disabled={!editMode}
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}