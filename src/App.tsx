import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Guard from "./components/Guard";
import ModalCreateSpace from "./components/ModalCreateSpace";
import ModalEditSpace from "./components/ModalEditSpace";
import ModalEditTask from "./components/ModalEditTask";
import Toast from "./components/Toast";
import { HaveSession } from "./guards/haveSession";
import AboutLayout from "./layouts/AboutLayout";
import AppLayout from "./layouts/AppLayout";
import SettingsLayout from "./layouts/SettingsLayout";
import Home from "./pages/Home";
import Inbox from "./pages/App/Inbox";
import Page404 from "./pages/Page404";
import PageError from "./pages/PageError";
import Space from "./pages/App/Space";
import ThemeSettings from "./pages/Settings/ThemeSettings";
import Today from "./pages/App/Today";
import Upcoming from "./pages/App/Upcoming";
import WorkspaceSettings from "./pages/Settings/WorkspaceSettings";
import TheProject from "./pages/About/TheProject";
import TheBasics from "./pages/About/TheBasics";
import ManageData from "./pages/About/ManageData";
import WhatsNext from "./pages/About/WhatsNext";
import Contribute from "./pages/About/Contribute";
import { useThemeStore } from "./stores/theme";

function App() {
    let { accent, theme } = useThemeStore();

    useEffect(() => {
        document.body.className = `${accent} ${theme}`;
    }, [accent, theme]);

    return (
        <>
            <Toast></Toast>
            <BrowserRouter>
                <Routes>
                    <Route index path="/" element={<Home />}></Route>
                    <Route path="/about" element={<AboutLayout />}>
                        <Route index path="get-started/the-project" element={<TheProject />}></Route>
                        <Route index path="get-started/the-basics" element={<TheBasics />}></Route>
                        <Route index path="get-started/manage-data" element={<ManageData />}></Route>
                        <Route index path="future/whats-next" element={<WhatsNext />}></Route>
                        <Route index path="future/contribute" element={<Contribute />}></Route>
                    </Route>
                    <Route
                        path="app"
                        element={
                            <Guard redirect="/" guards={[HaveSession]}>
                                <AppLayout />
                            </Guard>
                        }
                    >
                        <Route
                            path="settings"
                            element={
                                <Guard redirect="/" guards={[HaveSession]}>
                                    <SettingsLayout />
                                </Guard>
                            }
                        >
                            <Route index path="workspace" element={<WorkspaceSettings />}></Route>
                            <Route index path="theme" element={<ThemeSettings />}></Route>
                        </Route>
                        <Route
                            path="inbox"
                            element={
                                <>
                                    <Inbox />
                                    <Outlet></Outlet>
                                </>
                            }
                        >
                            <Route index path="create-space" element={<ModalCreateSpace />}></Route>
                            <Route index path="task/:taskId" element={<ModalEditTask />}></Route>
                            <Route index path="edit-space/:spaceId" element={<ModalEditSpace></ModalEditSpace>}></Route>
                        </Route>
                        <Route
                            path="today"
                            element={
                                <>
                                    <Today />
                                    <Outlet></Outlet>
                                </>
                            }
                        >
                            <Route index path="create-space" element={<ModalCreateSpace></ModalCreateSpace>}></Route>
                            <Route path="task/:taskId" element={<ModalEditTask />}></Route>
                            <Route index path="edit-space/:spaceId" element={<ModalEditSpace></ModalEditSpace>}></Route>
                        </Route>
                        <Route
                            path="upcoming"
                            element={
                                <>
                                    <Upcoming />
                                    <Outlet></Outlet>
                                </>
                            }
                        >
                            <Route index path="create-space" element={<ModalCreateSpace></ModalCreateSpace>}></Route>
                            <Route path="task/:taskId" element={<ModalEditTask />}></Route>
                            <Route index path="edit-space/:spaceId" element={<ModalEditSpace></ModalEditSpace>}></Route>
                        </Route>
                        <Route
                            path="spaces/:spaceId"
                            element={
                                <>
                                    <Space />
                                    <Outlet />
                                </>
                            }
                        >
                            <Route index path="create-space" element={<ModalCreateSpace></ModalCreateSpace>}></Route>
                            <Route index path="edit-space/:spaceId" element={<ModalEditSpace></ModalEditSpace>}></Route>
                            <Route path="task/:taskId" element={<ModalEditTask />}></Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<Page404 />}></Route>
                    <Route path="/error" element={<PageError />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
