import { FieldHookConfig, useField } from 'formik'
import { FC, ReactElement } from 'react'
import { Form, InputGroup } from 'react-bootstrap'

type TextFieldProps = FieldHookConfig<string> & {
  label: string
  append?: ReactElement
}


export const TextField: FC<TextFieldProps> = ({ label, append, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type="text" {...field}
          placeholder={props.placeholder}
          isInvalid={meta.touched && meta.error != null}
        />
        {append && <InputGroup.Append>{append}</InputGroup.Append>}
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        {meta.error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}
