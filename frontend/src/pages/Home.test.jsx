import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import '@testing-library/jest-dom'

const renderHome = () => render(
    <MemoryRouter>
        <Home />
    </MemoryRouter>
)

describe('Home [Home.test.jsx]', () => {

    it('should render', () => {
        renderHome()
        expect(document.body).toBeDefined()
    })

})