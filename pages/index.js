import { useAuth } from "../lib/auth";
import DashboardShell from "@/components/DashboardShell";
import SiteTableSkeleton from "@/components/SiteTableSkeleton";
export default function Index() {
    const auth = useAuth();
    return <h1>hello</h1>;
}
