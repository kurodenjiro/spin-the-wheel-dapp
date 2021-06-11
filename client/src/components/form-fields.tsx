import { FieldHookConfig, useField } from 'formik'
import { FC } from 'react'
import { Form } from 'react-bootstrap'

type TextFieldProps = FieldHookConfig<string>


export const TextField: FC<TextFieldProps> = (props) => {
  const [field, meta] = useField(props)
  return (
    <Form.Group>
      <Form.Control
        type="text" {...field}
        placeholder={props.placeholder}
        isInvalid={meta.touched && meta.error != null}
      />
      <Form.Control.Feedback type="invalid">
        {meta.error}
      </Form.Control.Feedback>
    </Form.Group>
  )
}
