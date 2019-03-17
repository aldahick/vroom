import { Button, createStyles, Grid, Input, WithStyles, withStyles } from "@material-ui/core";
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

const styles = createStyles({
  input: {
    paddingTop: "0.5em",
    width: "100%"
  },
  submitButton: {
    width: "100%"
  }
});

export const Form = withStyles(styles)(class <FieldKey extends string> extends React.Component<WithStyles<typeof styles> & FormProps<FieldKey>, FormState<FieldKey>> {
  constructor(props: FormProps<FieldKey>) {
    super(props as WithStyles<typeof styles> & FormProps<FieldKey>);
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
    ).some(v => !v)) { return; }
    const result = this.props.onSubmit(this.state.fieldValues);
    if (result instanceof Promise) {
      result.catch(console.error);
    }
  };

  render() {
    const { classes } = this.props;
    return [
      this.props.children,
      ..._.map(this.props.fields, (field, key: FieldKey) => (
        <Grid container justify="center">
          <Grid xs={12} sm={12} md={9} lg={6}>
            <Input
              key={key}
              type={field.type || "text"}
              value={this.state.fieldValues[key] || field.defaultValue || ""}
              placeholder={field.placeholder || key}
              onChange={this.onChange(key)}
              onKeyUp={this.onKeyUp}
              className={classes.input}
            />
          </Grid>
        </Grid>
      )), (
        <Grid container justify="center">
          <Grid xs={12} sm={8} md={6} lg={4} style={{ paddingTop: "1em" }}>
            <Button
              key="submit"
              variant="contained"
              color="primary"
              onClick={this.submit}
              className={classes.submitButton}
            >{this.props.submitText || "Submit"}
            </Button>
          </Grid>
        </Grid>
      )];
  }
});
