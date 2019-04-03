import { Button, createStyles, Grid, Input, Typography, WithStyles, withStyles } from "@material-ui/core";
import { InputProps } from "@material-ui/core/Input";
import _ from "lodash";
import React, { Fragment } from "react";

type FieldDefinition = {
  defaultValue?: string;
  /** default: false */
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
};

interface FormProps<Fields extends {[key: string]: string}> {
  errorMessage?: string;
  successMessage?: string;
  fields: { [key in keyof Fields]: FieldDefinition };
  onSubmit(fieldValues: Fields): Promise<void> | void;
  submitText?: string;
}

interface FormState<Fields extends {[key: string]: string}> {
  /** only contains changed values */
  fieldValues: {[key in keyof Fields]?: Fields[key]};
}

const styles = createStyles({
  inputContainer: {
    paddingTop: "0.5em"
  }
});

export const Form = withStyles(styles)(class <Fields extends {[key: string]: any}> extends React.Component<WithStyles<typeof styles> & FormProps<Fields>, FormState<Fields>> {
  constructor(props: FormProps<Fields>) {
    super(props as WithStyles<typeof styles> & FormProps<Fields>);
    this.state = {
      fieldValues: _.mapValues(this.props.fields, (field: FieldDefinition, key: keyof Fields) =>
        field.defaultValue || undefined) as any
    };
  }

  onChange = (field: keyof Fields) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fieldValues: {
        ...this.state.fieldValues,
        [field]: evt.target.value
      }
    });
  }

  onFileChange = (field: keyof Fields) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      fieldValues: {
        ...this.state.fieldValues,
        [field]: (evt.target.files && evt.target.files.length > 0)
          ? evt.target.files[0]
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
    if (_.map(this.props.fields, (field, key: keyof Fields) =>
      !field.isRequired || !!this.state.fieldValues[key]
    ).some(v => !v)) { return; }
    const result = this.props.onSubmit(_.cloneDeep(this.state.fieldValues) as any);
    if (result instanceof Promise) {
      result.catch(console.error);
    }
  }

  renderInput = (key: keyof Fields, field: FieldDefinition) => {
    const props: InputProps = {
      type: field.type || "text",
      value: this.state.fieldValues[key] || field.defaultValue || "",
      placeholder: field.placeholder || key as string,
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
    const { children, classes, errorMessage, successMessage, fields, submitText } = this.props;
    return (
      <Fragment>
        {errorMessage && (
          <Typography variant="subtitle2" color="error" align="center">
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="subtitle2" color="primary" align="center">
            {successMessage}
          </Typography>
        )}
        {children}
        {_.map(fields, (field: FieldDefinition, key: keyof Fields) => (
          <Grid
            container
            alignItems="center"
            direction="column"
            key={key as string}
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
