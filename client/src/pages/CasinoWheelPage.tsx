import { Form, Formik } from 'formik'
import { FC, useContext, useRef } from 'react'
import { Button, Container } from 'react-bootstrap'
import { toWei } from 'web3-utils'
import * as yup from 'yup'
import { AccountContext, CasinoContext } from '../App'
import { TextField } from '../components/form-fields'
import { Wheel, WheelRef } from '../components/Wheel'


const casinoWheelSchema = yup.object({
  amount: yup.number().moreThan(0).required(),
})

export const CasinoWheelPage: FC = () => {
  const account = useContext(AccountContext)
  const casino = useContext(CasinoContext)

  const prizes = [1, 2, 3, 4, 5]

  const wheelRef = useRef<WheelRef>(null)

  return (
    <Container>
      <Formik
        initialValues={{ amount: '0' }}
        validationSchema={casinoWheelSchema}
        onSubmit={async ({ amount }, { resetForm }) => {
          await casino.methods.spinWheel().send({ from: account, value: toWei(amount) })
          // TODO: calculate index in the smart contract
          wheelRef.current?.spinToIndex(Math.floor(Math.random() * prizes.length))
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
      <Wheel ref={wheelRef} prizes={prizes} />
    </Container>
  )
}
