import type { Document } from '@/types/db';

import MainEditor from '@/components/editor/main-editor';
import Logo from '@/components/logo';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';

type PageContentProps = {
  document: Document;
};

const PageContent = ({ document }: PageContentProps) => {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex h-16 w-full items-center justify-center border-b">
        <div className="flex w-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Logo />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{document.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div></div>
        </div>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75}>
          <div className="flex h-full w-full">
            <MainEditor document={document} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25}>
          <div>
            <div className="flex flex-col gap-2 p-2">
              <div className="">
                <p className="text-primary font-medium tracking-tighter">Caret AI</p>
              </div>
              <Separator />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default PageContent;
