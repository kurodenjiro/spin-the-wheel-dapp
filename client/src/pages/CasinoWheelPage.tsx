import BN from 'bn.js'
import { Form, Formik } from 'formik'
import { FC, useContext, useEffect, useRef, useState } from 'react'
import { Card, Container, InputGroup } from 'react-bootstrap'
import { useQueryClient } from 'react-query'
import { Subscription } from 'web3-core-subscriptions'
import { fromWei, toWei } from 'web3-utils'
import * as yup from 'yup'
import { AccountContext, CasinoContext } from '../App'
import { FormButton, TextField } from '../components/form-fields'
import { Header } from '../components/Header'
import { Wheel, WheelRef } from '../components/Wheel'
import { shuffleExceptAt } from '../utils/collections'


const casinoWheelSchema = yup.object({
  amount: yup.number().moreThan(0).required(),
})

export const CasinoWheelPage: FC = () => {
  const account = useContext(AccountContext)
  const casino = useContext(CasinoContext)

  const queryClient = useQueryClient()

  const [prizes, setPrizes] = useState(['1', '2', '3'])
  const wheelRef = useRef<WheelRef>(null)

  useEffect(() => {
    const subscription = casino.events.WheelSpin(async (error, data) => {
      if (error != null) {
        console.error(error)
        return
      }
      const wonPrizeIndex = new BN(data.returnValues.wonPrizeIndex).toNumber()
      const potentialPrizes = data.returnValues.potentialPrizes.map(p => fromWei(p))
      // Shuffle all prizes except the prize at index `wonPrizeIndex`
      const shuffledPrizes = shuffleExceptAt(potentialPrizes, wonPrizeIndex)
      setPrizes(shuffledPrizes)
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
      <Container className="mt-4 d-flex justify-content-center">
        <div style={{ maxWidth: '700px' }}>
          <Card>
            <Card.Header as="h3">
              Spin the Wheel! Enter amount and spin
            </Card.Header>
            <Card.Body>
              <Formik
                initialValues={{ amount: '' }}
                validationSchema={casinoWheelSchema}
                onSubmit={async ({ amount }, { resetForm }) => {
                  await casino.methods.spinWheel().send({ from: account, value: toWei(amount) })
                  resetForm()
                }}
              >
                {() => (
                  <Form>
                    <TextField
                      name="amount"
                      label="Bet amount"
                      placeholder="Enter your bet"
                      append={<InputGroup.Text>ETH</InputGroup.Text>}
                    />
                    <FormButton>Spin the wheel</FormButton>
                  </Form>
                )}
              </Formik>
              <div className="d-flex justify-content-center">
                <Wheel ref={wheelRef} prizes={prizes} />
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  )
}
