import {
    DivideIcon as LucideIcon,
    LayoutDashboard,
    Shield,
    Settings,
    AlignJustify,
    Home,
    BarChart,
    FileText,
    Users,
    Building,
    Database,
    ShoppingBag,
    LineChart,
    Activity,
    Globe,
    Smartphone,
    User,
    HelpCircle,
    Palette,
    Languages,
    DollarSign,
    ClipboardList,
    Boxes
} from 'lucide-react';

interface AdminNavigationItem {
    Id: number;
    Title: string;
    Description: string;
    Icon: string;
    Link: string;
    EnableNav: boolean;
    ParentId: number;
    DisplayOrder: number;
    Module: {
        Id: number;
        Name: string;
        Code: string;
        EnableManagement: boolean;
    };
}

export interface NavigationItem {
    id: string;
    title: string;
    href: string;
    icon?: typeof LucideIcon;
    description?: string;
    children?: NavigationItem[];
}

const ICON_MAP: Record<string, typeof LucideIcon> = {
    // Main navigation icons
    'dashboard': LayoutDashboard,
    'security': Shield,
    'settings': Settings,
    'format_line_spacing': AlignJustify,
    'home': Home,
    'show_chart': BarChart,

    // Section icons
    'document': FileText,
    'users': Users,
    'building': Building,
    'database': Database,
    'store': ShoppingBag,
    'chart': LineChart,
    'activity': Activity,

    // Settings section icons
    'global': Globe,
    'mobile': Smartphone,
    'user': User,
    'help': HelpCircle,
    'theme': Palette,
    'language': Languages,
    'currency': DollarSign,
    'list': ClipboardList,
    'box': Boxes,

    // Default fallback
    'default': Settings
};

export function buildNavigation(items: AdminNavigationItem[]): NavigationItem[] {
    // First, sort items by DisplayOrder
    const sortedItems = [...items].sort((a, b) => a.DisplayOrder - b.DisplayOrder);

    // Create a map for quick parent lookup
    const itemMap = new Map<number, NavigationItem>();

    // Initialize result array for root items
    const result: NavigationItem[] = [];

    // First pass: Create all navigation items
    sortedItems.forEach(item => {
        if (!item.EnableNav) return;

        const navItem: NavigationItem = {
            id: item.Id.toString(),
            title: item.Title,
            href: item.Link || '#',
            description: item.Description,
            icon: ICON_MAP[item.Icon?.toLowerCase()] || Settings,
            children: []
        };

        itemMap.set(item.Id, navItem);

        // Add to result if it's a root item
        if (item.ParentId === 0) {
            result.push(navItem);
        }
    });

    // Second pass: Build hierarchy
    sortedItems.forEach(item => {
        if (!item.EnableNav) return;

        if (item.ParentId !== 0) {
            const parent = itemMap.get(item.ParentId);
            const child = itemMap.get(item.Id);

            if (parent && child) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(child);
            }
        }
    });

    return result;
}