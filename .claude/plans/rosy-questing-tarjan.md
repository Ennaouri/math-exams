# Navbar Enhancement Plan

## Context
The current navbar provides basic navigation and authentication status but lacks:
1. Search functionality (common in educational platforms)
2. Role-specific quick actions
3. Enhanced visual feedback for admin/users
4. Quick access to profile features

## Problem
Users (especially admins and regular users) need faster access to:
- Search functionality to find content quickly
- Role-specific dashboard links
- Profile management options
- Quick notifications or activity indicators

## Solution
Enhance the navbar with:
1. Integrated search bar (visible on desktop, collapsible on mobile)
2. Enhanced profile dropdown with role-specific quick actions
3. Better visual indicators for admin status
4. Notification/badge system for updates

## Implementation Details

### Files to Modify
- `app/components/Navbar.tsx` - Main navbar component

### Changes to Make

#### 1. Add Search Functionality
- Add search input to navbar (desktop view)
- Make it collapsible/icon-based on mobile
- Use existing search API route (`/api/search`)
- Route to search page on submit

#### 2. Enhanced Profile Dropdown
For Admin Users:
- Quick links: Admin Dashboard, Posts Management, Categories, Analytics
- Activity indicator: Show pending items if any

For Regular Users:
- Quick links: Profile, Favorites, My Posts (if applicable)
- Progress indicator: Show completed exercises/courses count

#### 3. Visual Improvements
- More prominent role badges with better colors
- Avatar with status indicator (online/offline)
- Smooth animations for dropdowns

#### 4. Role-Based Content
- Show different nav items based on user role
- Admin sees management links in navbar
- Regular user sees learning-focused links

### Reuse Existing Components/Functions
- Use existing `useSession` hook from next-auth/react
- Reuse existing search API (`/api/search`)
- Reuse existing profile/image handling logic
- Use existing role detection from session

### Verification Steps
1. Verify navbar renders correctly for:
   - Guest users (not logged in)
   - Regular users (logged in)
   - Admin users (logged in)
2. Test search functionality works from navbar
3. Verify profile dropdown shows correct options for each role
4. Check responsive behavior (mobile vs desktop)
5. Ensure all existing functionality still works

## Implementation Approach
1. First, add search bar to navbar desktop view
2. Enhance profile dropdown with role-specific content
3. Add visual improvements and animations
4. Test all scenarios