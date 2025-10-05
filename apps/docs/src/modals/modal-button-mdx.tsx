import fs from "node:fs/promises";
import { highlight } from "fumadocs-core/highlight";
import * as Base from "fumadocs-ui/components/codeblock";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import { ModalButton } from "@/modals/modal-button";
import { modals } from "@/modals/registry";

export async function ModalButtonMDX({
  variant,
  file,
  options = [],
}: {
  variant: string;
  options: { name: string; value: string; values: string[] }[];
  file?: string;
}) {
  const code = await fs.readFile(
    `${process.cwd()}/src/modals/variants/${file ?? variant}.tsx`,
    "utf-8",
  );

  const rest = {};

  const exists = modals._def.variants[variant];

  if (!exists) throw new Error(`Variant ${variant} does not exist`);

  const rendered = await highlight(code, {
    lang: "tsx",
    components: {
      pre: (props) => <Base.Pre {...props} />,
    },
  });

  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <ModalButton variant={variant} options={options} />
      </TabsContent>
      <TabsContent value="code">
        <Base.CodeBlock {...rest}>{rendered}</Base.CodeBlock>
      </TabsContent>
    </Tabs>
  );
}
