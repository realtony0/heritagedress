type SchemaScriptProps = {
  id: string;
  schema: Record<string, unknown>;
};

export function SchemaScript({ id, schema }: SchemaScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
