import Logo from '@/components/logo';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Document } from '@/types/db';

interface EditorHeaderProps {
  document: Document;
}

const EditorHeader = ({ document }: EditorHeaderProps) => {
  return (
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
  );
};

export default EditorHeader;
