import { Button, Input } from "@material-ui/core";
import * as _ from "lodash";
import React from "react";

type FieldDefinition = {
  defaultValue?: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
};

interface FormProps<FieldKey extends string> {
  fields: { [key in FieldKey]: FieldDefinition };
  onSubmit(fieldValues: { [key in FieldKey]?: string }): Promise<void> | void;
  submitText?: string;
}

interface FormState<FieldKey extends string> {
  fieldValues: { [key in FieldKey]?: string };
}

export class Form<FieldKey extends string> extends React.Component<FormProps<FieldKey>, FormState<FieldKey>> {
  constructor(props: FormProps<FieldKey>) {
    super(props);
    this.state = {
      fieldValues: _.mapValues(this.props.fields, (field: FieldDefinition, key: FieldKey) =>
        field.defaultValue || undefined) as any
    };
  }

  onChange = (field: FieldKey) => (evt: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({
      fieldValues: {
        ...this.state.fieldValues,
        [field]: evt.target.value
      }
    });

  onKeyUp = (evt: React.KeyboardEvent) => {
    if (evt.key === "Enter") {
      this.submit();
    }
  }

  submit = () => {
    // if any required fields are not filled in
    if (_.map(this.props.fields, (field, key: FieldKey) =>
      !field.isRequired || !!this.state.fieldValues[key]
    ).some(v => !v)) {
      return;
    }
    console.log(this.state.fieldValues);
    const result = this.props.onSubmit(this.state.fieldValues);
    if (result instanceof Promise) {
      result.catch(console.error);
    }
  };

  render() {
    return [
      this.props.children,
      ..._.map(this.props.fields, (field, key: FieldKey) => (
        <Input
          key={key}
          type={field.type || "text"}
          value={this.state.fieldValues[key] || field.defaultValue || ""}
          placeholder={field.placeholder || key}
          onChange={this.onChange(key)}
          onKeyUp={this.onKeyUp}
        />
      )), (
      <Button
        key="submit"
        variant="contained"
        color="primary"
        onClick={this.submit}
      >{this.props.submitText || "Submit"}
      </Button>
    )];
  }
}
