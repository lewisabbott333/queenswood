/**
 * MaterialIcon – wraps Google Material Symbols (Filled variant)
 * Drop-in replacement for lucide-react icons.
 * Usage: <MaterialIcon name="arrow_forward" className="w-5 h-5" />
 *
 * The font is loaded in index.html via:
 *   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
 */

import React from 'react';

interface MaterialIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  fill?: boolean;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  style = {},
  size,
  fill = true,
}) => {
  const sizeStyle = size ? { fontSize: size } : {};
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24`,
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        ...sizeStyle,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};

export default MaterialIcon;

// ─── Named exports matching lucide-react API ────────────────────────────────
// Each is a tiny wrapper so call-sites stay identical: <ArrowRight className="w-5 h-5" />

type IconProps = { className?: string; size?: number; style?: React.CSSProperties };

const mk = (iconName: string) =>
  ({ className, size, style }: IconProps) => (
    <MaterialIcon name={iconName} className={className} size={size} style={style} />
  );

export const AlertCircle    = mk('error');
export const ArrowLeft      = mk('arrow_back');
export const ArrowRight     = mk('arrow_forward');
export const BookOpen       = mk('menu_book');
export const Briefcase      = mk('work');
export const Building2      = mk('apartment');
export const Calendar       = mk('calendar_month');
export const Check          = mk('check');
export const CheckCircle    = mk('check_circle');
export const ChevronDown    = mk('expand_more');
export const Clock          = mk('schedule');
export const CreditCard     = mk('credit_card');
export const Edit3          = mk('edit');
export const Eye            = mk('visibility');
export const EyeOff         = mk('visibility_off');
export const FileText       = mk('description');
export const Globe          = mk('language');
export const Handshake      = mk('handshake');
export const Heart          = mk('favorite');
export const Image          = mk('image');
export const ImagePlus      = mk('add_photo_alternate');
export const LayoutDashboard = mk('dashboard');
export const Lightbulb      = mk('lightbulb');
export const Linkedin       = mk('work'); // no LinkedIn in Material – work is nearest
export const LogOut         = mk('logout');
export const Mail           = mk('mail');
export const MapPin         = mk('location_on');
export const Menu           = mk('menu');
export const MessageSquare  = mk('chat');
export const Mic            = mk('mic');
export const Moon           = mk('dark_mode');
export const Network        = mk('hub');
export const Palette        = mk('palette');
export const Phone          = mk('call');
export const Play           = mk('play_circle');
export const Plus           = mk('add');
export const Quote          = mk('format_quote');
export const Search         = mk('search');
export const Settings       = mk('settings');
export const ShieldCheck    = mk('verified_user');
export const ShoppingCart   = mk('shopping_cart');
export const Sun            = mk('light_mode');
export const Tag            = mk('label');
export const Target         = mk('my_location');
export const Tractor        = mk('agriculture');
export const Trash2         = mk('delete');
export const Upload         = mk('upload');
export const User           = mk('person');
export const UserPlus       = mk('person_add');
export const Users          = mk('group');
export const Video          = mk('videocam');
export const X              = mk('close');
export const Camera         = mk('photo_camera');
