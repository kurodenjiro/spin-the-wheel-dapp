import { Form, Formik } from 'formik'
import { FC, useContext } from 'react'
import { Button, Container } from 'react-bootstrap'
import { toWei } from 'web3-utils'
import * as yup from 'yup'
import { AccountContext, CasinoContext } from '../App'
import { TextField } from '../components/form-fields'


const casinoWheelSchema = yup.object({
  amount: yup.number().moreThan(0).required(),
})

export const CasinoWheelPage: FC = () => {
  const account = useContext(AccountContext)
  const casino = useContext(CasinoContext)

  return (
    <Container>
      <Formik
        initialValues={{ amount: '0' }}
        validationSchema={casinoWheelSchema}
        onSubmit={async ({ amount }, { resetForm }) => {
          await casino.methods.spinWheel().send({ from: account, value: toWei(amount.toString()) })
          resetForm()
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextField name="amount" />
            <Button type="submit" disabled={isSubmitting}>Spin the wheel</Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
