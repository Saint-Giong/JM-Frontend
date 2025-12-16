'use client';

import { Separator } from '@saint-giong/bamboo-ui';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import type { ProfileFormData } from './types';

interface ProfileSidebarProps {
  formData: ProfileFormData;
}

export function ProfileSidebar({ formData }: ProfileSidebarProps) {
  return (
    <div className="w-full space-y-6 lg:w-80 lg:flex-shrink-0">
      {/* About Us */}
      <div className="space-y-3">
        <h3 className="section-heading">About us</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {formData.aboutUs}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Quisque ac enim diam nunc et morbi enim vitae eu. Ultrices odio nullam
          egestas aliquam id quis consectetur porttitor. Amet erat in sapien
          lorem elementum tortor interdum augue. Eleifend turpis quis metus id
          aliquet et sit suscipit luctus. Erat dolor aenean condimentum sagittis
          est ac id. Luctus dolor ut sem pellentesque.
        </p>
      </div>

      <Separator />

      {/* Contact */}
      <div className="space-y-4">
        <h3 className="section-heading">Contact</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Address</p>
            <p className="text-muted-foreground">{formData.address}</p>
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">(+84) {formData.phone}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{formData.email}</p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Linkedin className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Facebook className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
