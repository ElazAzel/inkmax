import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { withBlockEditor, type BaseBlockEditorProps } from './BlockEditorWrapper';
import { validateFormBlock } from '@/lib/block-validators';
import { ArrayFieldList } from '@/components/form-fields/ArrayFieldList';
import { ArrayFieldItem } from '@/components/form-fields/ArrayFieldItem';

function FormBlockEditorComponent({ formData, onChange }: BaseBlockEditorProps) {
  const fields = formData.fields || [];

  const addField = () => {
    onChange({
      ...formData,
      fields: [...fields, { name: '', type: 'text', required: false }],
    });
  };

  const removeField = (index: number) => {
    onChange({
      ...formData,
      fields: fields.filter((_: any, i: number) => i !== index),
    });
  };

  const updateField = (index: number, field: string, value: any) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...formData, fields: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Form Title</Label>
        <Input
          value={formData.title || ''}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="Contact Form"
        />
      </div>

      <div>
        <Label>Button Text</Label>
        <Input
          value={formData.buttonText || 'Send'}
          onChange={(e) => onChange({ ...formData, buttonText: e.target.value })}
          placeholder="Send"
        />
      </div>

      <ArrayFieldList label="Form Fields" items={fields} onAdd={addField}>
        {fields.map((field: any, index: number) => (
          <ArrayFieldItem
            key={index}
            index={index}
            label="Field"
            onRemove={() => removeField(index)}
          >
            <div>
              <Label className="text-xs">Field Name</Label>
              <Input
                value={field.name}
                onChange={(e) => updateField(index, 'name', e.target.value)}
                placeholder="Name"
              />
            </div>

            <div>
              <Label className="text-xs">Field Type</Label>
              <Select
                value={field.type}
                onValueChange={(value) => updateField(index, 'type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`required-${index}`}
                checked={field.required || false}
                onChange={(e) => updateField(index, 'required', e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor={`required-${index}`} className="cursor-pointer text-xs">
                Required field
              </Label>
            </div>
          </ArrayFieldItem>
        ))}
      </ArrayFieldList>
    </div>
  );
}

export const FormBlockEditor = withBlockEditor(FormBlockEditorComponent, {
  hint: 'Create a contact form with custom fields',
  validate: validateFormBlock,
  isPremium: true,
  description: 'Collect user information with customizable form fields',
});
