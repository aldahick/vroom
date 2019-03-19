import { Button, createStyles, Grid, Input, Typography, WithStyles, withStyles } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import * as _ from "lodash";
import React, { Fragment } from "react";

type FieldDefinition = {
  defaultValue?: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
};

interface FormProps<FieldKey extends string> {
  errorMessage?: string;
  fields: { [key in FieldKey]: FieldDefinition };
  onSubmit(fieldValues: { [key in FieldKey]?: string | File }): Promise<void> | void;
  submitText?: string;
}

interface FormState<FieldKey extends string> {
  fieldValues: { [key in FieldKey]?: string | File };
}

const styles = createStyles({
  inputContainer: {
    paddingTop: "0.5em"
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

  onChange = (field: FieldKey) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fieldValues: {
        ...this.state.fieldValues,
        [field]: evt.target.value
      }
    });
  }

  onFileChange = (field: FieldKey) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fieldValues: {
        ...this.state.fieldValues,
        [field]: (evt.target.files && evt.target.files.length > 0)
          ? evt.target.files![0]
          : undefined
      }
    });
  }

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
  }

  renderInput = (key: FieldKey, field: FieldDefinition) => {
    const props: InputProps = {
      type: field.type || "text",
      value: this.state.fieldValues[key] || field.defaultValue || "",
      placeholder: field.placeholder || key,
      onChange: this.onChange(key),
      onKeyUp: this.onKeyUp
    };
    if (field.type === "file") {
      delete props.value;
      props.onChange = this.onFileChange(key);
      return (
        <Fragment>
          <Typography style={{ fontWeight: "bold" }}>
            {this.state.fieldValues[key] ? (this.state.fieldValues[key] as File).name : ""}
          </Typography>
          <Button variant="contained" component="label">
            {field.placeholder || "Upload File"}
            <Input {...props} style={{ display: "none" }} />
          </Button>
        </Fragment>
      );
    }
    return <Input {...props} />;
  }

  render() {
    const { children, classes, errorMessage, fields, submitText } = this.props;
    console.log(errorMessage);
    return (
      <Fragment>
        {errorMessage && (
          <Typography variant="subheading" color="error" align="center">
            {errorMessage}
          </Typography>
        )}
        {children}
        {_.map(fields, (field: FieldDefinition, key: FieldKey) => (
          <Grid
            container
            alignItems="center"
            direction="column"
            key={key}
            className={classes.inputContainer}
          >
            {this.renderInput(key, field)}
          </Grid>
        ))}
        <Grid container justify="center" style={{ paddingTop: "2em" }}>
          <Button
            key="submit"
            variant="contained"
            color="primary"
            onClick={this.submit}
          >{submitText || "Submit"}
          </Button>
        </Grid>
      </Fragment>
    );
  }
});
