import { NoSSR } from "rspress/runtime";
import { Layout as BasicLayout } from "rspress/theme";
import { Announcement } from "@/components/announcement";

const Layout = () => {
    return (
        <BasicLayout
            // beforeNavTitle={<NavIcon />}
            beforeNav={
                <NoSSR>
                    <Announcement
                        href="/"
                        message="🚧 Ziyy's documentation is under development"
                        localStorageKey="ziyy-announcement-closed"
                    />
                </NoSSR>
            }
        />
    );
};

export { Layout };
export * from "rspress/theme";
