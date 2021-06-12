import BN from 'bn.js'
import { Form, Formik } from 'formik'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Subscription } from 'web3-core-subscriptions'
import { fromWei, toWei } from 'web3-utils'
import * as yup from 'yup'
import { AccountContext, CasinoContext } from '../App'
import { TextField } from '../components/form-fields'
import { Header } from '../components/Header'
import { Wheel, WheelRef } from '../components/Wheel'


const casinoWheelSchema = yup.object({
  amount: yup.number().moreThan(0).required(),
})

export const CasinoWheelPage: FC = () => {
  const account = useContext(AccountContext)
  const casino = useContext(CasinoContext)

  const queryClient = useQueryClient()

  const [prizes, setPrizes] = useState<string[]>([])
  const wheelRef = useRef<WheelRef>(null)

  useEffect(() => {
    const subscription = casino.events.WheelSpin(async (error, data) => {
      if (error != null) {
        console.error(error)
        return
      }
      const wonPrizeIndex = new BN(data.returnValues.wonPrizeIndex).toNumber()
      const potentialPrizes = data.returnValues.potentialPrizes.map(p => fromWei(p))
      setPrizes(potentialPrizes)
      await wheelRef.current?.spinToIndex(wonPrizeIndex, 5)
      await queryClient.invalidateQueries('balance')
    }) as unknown as Subscription<unknown>
    return () => {
      subscription.unsubscribe()
    }
  }, [casino.events, queryClient])

  return (
    <>
      <Header />
      <Container className="mt-4">
        <Formik
          initialValues={{ amount: '' }}
          validationSchema={casinoWheelSchema}
          onSubmit={async ({ amount }, { resetForm }) => {
            await casino.methods.spinWheel().send({ from: account, value: toWei(amount) })
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
    </>
  )
}
