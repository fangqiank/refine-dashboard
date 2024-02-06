import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { dataProvider, liveProvider, authProvider } from "./providers";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home"
import { CompanyList } from "./pages/company/list";
import { CompanyCreate } from "./pages/company/create";
import { CompanyEdit } from "./pages/company/edit";
import { TaskList } from "./pages/task/taskList";
import {TaskCreate} from '@/pages/task/task-create'
import { TaskEdit } from "./pages/task/task-edit"
import { ForgotPassword } from "./pages/forgotPassword"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { Layout } from "./components/layout"
import { resouces } from "./config/resources";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={resouces}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "zbz8NB-uWQrxl-5IPEWe",
                liveMode: "auto",
              }}
            >
              <Routes>
                <Route path="/forgot-password" index element={<ForgotPassword />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                   <Route index element={<Home />} />
                   <Route path="/companies">
                    <Route index element={<CompanyList />}/>
                    <Route path="new" element={<CompanyCreate />} />
                    <Route path="edit/:id" element={<CompanyEdit />} />
                   </Route>
                   <Route path="/tasks" element={
                    <TaskList>
                      <Outlet />
                    </TaskList>
                   }>
                    <Route path='new' element={<TaskCreate />} />
                    <Route path='edit/:id' element={<TaskEdit />} />
                   </Route>
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
