import { fireEvent, render, screen } from '@testing-library/react'
import { Form, Formik, FormikConfig } from 'formik'
import { ReactElement } from 'react'
import * as yup from 'yup'
import { sleep } from '../utils/time'
import { TextField } from './form-fields'

async function waitForValidation() {
  await sleep(10)
}

function renderComponent<V>(element: ReactElement, formikProps: Omit<FormikConfig<V>, 'onSubmit'>) {
  let values: V
  const comp = render(
    <Formik
      {...formikProps}
      onSubmit={v => {
        values = v
      }}
    >
      <Form>
        {element}
        <button type="submit">__submit</button>
      </Form>
    </Formik>,
  )
  return {
    comp,
    async submit() {
      fireEvent.click(comp.getByText(/__submit/i))
      await waitForValidation()
      return values
    },
  }
}

describe('TextField', () => {
  test('input text', async () => {
    const { submit } = renderComponent(
      <TextField name="firstName" placeholder="First Name" />,
      {
        initialValues: { firstName: '' },
      },
    )
    const textInput = screen.getByPlaceholderText('First Name')
    fireEvent.input(textInput, { target: { value: 'Alice' } })
    const { firstName } = await submit()
    expect(firstName).toEqual('Alice')
  })

  test('error message', async () => {
    const { comp, submit } = renderComponent(
      <TextField name="firstName" placeholder="First Name" />,
      {
        initialValues: { firstName: '' },
        validationSchema: yup.object({
          firstName: yup.string().min(2),
        }),
      },
    )
    const textInput = screen.getByPlaceholderText('First Name')
    fireEvent.input(textInput, { target: { value: 'A' } })
    fireEvent.blur(textInput)
    await waitForValidation()
    expect(screen.getByText('firstName must be at least 2 characters')).toBeInTheDocument()
  })
})
