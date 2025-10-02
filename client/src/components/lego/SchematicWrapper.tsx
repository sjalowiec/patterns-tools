interface SchematicWrapperProps {
  svgHtml: string;
  testId?: string;
}

export function SchematicWrapper({ svgHtml, testId = "schematic-diagram" }: SchematicWrapperProps) {
  return (
    <div 
      id="schematic" 
      style={{ textAlign: 'center', padding: '20px' }}
      data-testid={testId}
    >
      <div dangerouslySetInnerHTML={{ __html: svgHtml }} />
    </div>
  );
}
