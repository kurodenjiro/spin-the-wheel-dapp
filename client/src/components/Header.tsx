import { FC, useContext } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { AccountContext } from '../App'
import { DisplayBalance } from './DisplayBalance'

export const Header: FC = () => {
  const account = useContext(AccountContext)

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Navbar.Brand>Casino</Navbar.Brand>
      <Nav className="ml-auto">
        <Navbar.Text>Your account: {account}</Navbar.Text>
        <span className="ml-4" />
        <Navbar.Text><DisplayBalance /></Navbar.Text>
      </Nav>
    </Navbar>
  )
}
