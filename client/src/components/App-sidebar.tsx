// import { url } from 'inspector';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from './ui/sidebar';
import {
    Bot,
    CreditCard,
    LayoutDashboard,
    Plus,
    Presentation,
} from 'lucide-react';
// import { title } from 'process';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import LogoutButton from './LogoutButton';

const items = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Q&A',
        url: '/qa',
        icon: Bot,
    },
    {
        title: 'Meetings',
        url: '/meetings',
        icon: Presentation,
    },
    {
        title: 'Billing',
        url: '/billing',
        icon: CreditCard,
    },
];

const projects = [
    {
        name: 'Project 1',
    },
    {
        name: 'Project 2',
    },
    {
        name: 'Project 3',
    },
];
export default function AppSidebar() {
    const location = useLocation();
    const pathname = location.pathname;
    const { open } = useSidebar();
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <img
                        src="/githublogo.png"
                        alt="logo"
                        width={60}
                        height={60}
                    />
                    {open && (
                        <h1 className="text-xl font-bold text-primary/80 ">
                            GitGinie
                        </h1>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                to={item.url}
                                                className={cn({
                                                    '!bg-primary !text-white':
                                                        pathname === item.url,
                                                })}
                                            >
                                                <item.icon /> {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Your projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects.map((project) => {
                                return (
                                    <SidebarMenuItem key={project.name}>
                                        <SidebarMenuButton asChild>
                                            <div>
                                                <div
                                                    className={cn(
                                                        'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                                        {
                                                            'bg-primary text-white':
                                                                true,
                                                        }
                                                    )}
                                                >
                                                    {project.name[0]}
                                                </div>
                                                <span>{project.name}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                            <div className="h-2"></div>

                            {open && (
                                <SidebarMenuItem>
                                    <Link to="/create">
                                        <Button
                                            size="sm"
                                            variant={'outline'}
                                            className="w-fit"
                                        >
                                            <Plus />
                                            Create project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <LogoutButton />
            </SidebarFooter>
        </Sidebar>
    );
}
