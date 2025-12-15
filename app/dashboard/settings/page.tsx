'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Globe, CreditCard, Building2, Plane, Key } from "lucide-react";
import { toast } from "sonner";

interface Setting {
  key: string;
  value: string;
  type: string;
  group: string;
  description: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, Setting[]>>({});

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (group: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const groupSettings = settings[group];
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          settings: groupSettings
        })
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSettingValue = (group: string, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [group]: prev[group].map(s => s.key === key ? { ...s, value } : s)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">
          Manage your platform configuration, API integrations, and branding.
        </p>
      </div>
      <Separator className="my-6" />

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Key className="h-4 w-4" /> API Integrations
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Payment Gateways
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Branding
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>
                Configure basic platform settings, domains, and contact info.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Platform Name</Label>
                  <Input 
                    placeholder="NOVAX TRAVEL" 
                    defaultValue="NOVAX TRAVEL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Support Email</Label>
                  <Input 
                    placeholder="support@novaxtravel.com" 
                    defaultValue="support@novaxtravel.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Custom Domain</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="www.yourdomain.com" 
                      defaultValue="www.novaxtravel.com"
                    />
                    <Button variant="outline">Verify</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your custom domain to connect it to the platform.
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => handleSave('general')} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travel API Providers</CardTitle>
              <CardDescription>
                Manage keys and endpoints for flight and hotel providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Travelpayouts */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Travelpayouts</Label>
                    <p className="text-sm text-muted-foreground">
                      Primary provider for flights and hotels aggregation.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2 pl-6 border-l-2 border-muted">
                  <div className="grid gap-1">
                    <Label>API Token</Label>
                    <Input type="password" placeholder="Enter your Travelpayouts token" />
                  </div>
                  <div className="grid gap-1">
                    <Label>Marker ID</Label>
                    <Input placeholder="Enter your Marker ID" />
                  </div>
                </div>
              </div>
              <Separator />
              
              {/* Amadeus */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Amadeus</Label>
                    <p className="text-sm text-muted-foreground">
                      Enterprise flight booking and GDS access.
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="grid gap-2 pl-6 border-l-2 border-muted opacity-50 pointer-events-none">
                  <div className="grid gap-1">
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter Amadeus API Key" />
                  </div>
                  <div className="grid gap-1">
                    <Label>API Secret</Label>
                    <Input type="password" placeholder="Enter Amadeus API Secret" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={() => handleSave('integrations')} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Integration Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Gateways */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>
                Configure Stripe, PayPal, and other payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Stripe</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept credit cards and global payments.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2 pl-6 border-l-2 border-muted">
                  <div className="grid gap-1">
                    <Label>Publishable Key</Label>
                    <Input placeholder="pk_test_..." />
                  </div>
                  <div className="grid gap-1">
                    <Label>Secret Key</Label>
                    <Input type="password" placeholder="sk_test_..." />
                  </div>
                  <div className="grid gap-1">
                    <Label>Webhook Secret</Label>
                    <Input type="password" placeholder="whsec_..." />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={() => handleSave('payment')} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
