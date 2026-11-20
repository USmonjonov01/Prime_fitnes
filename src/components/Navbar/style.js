import styled, { css } from "styled-components"
import { Link, NavLink } from "react-router-dom"
import { colors, fonts, layout, media } from "../../utils/theme"

export const Header = styled.header`
     position: fixed;
     inset: 0 0 auto 0;
     z-index: 50;
     height: ${layout.navHeight};
     border-bottom: 1px solid transparent;
     transition: background-color 0.25s ease, border-color 0.25s ease;

     ${({ $solid }) => $solid && css`
          background: rgba(5, 9, 24, 0.82);
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
          border-bottom-color: ${colors.line};
     `}
`

export const Bar = styled.div`
     display: flex;
     align-items: center;
     gap: 1rem;
     height: 100%;
     max-width: ${layout.maxWidth};
     margin: 0 auto;
     padding: 0 ${layout.gutter};
`

export const Brand = styled(Link)`
     margin-right: auto;
     display: inline-flex;
     align-items: baseline;
     gap: 0.35em;
     text-decoration: none;
     color: ${colors.floor};
     font-family: ${fonts.heading};
     font-weight: 800;
     font-stretch: 125%;
     font-size: 1.2rem;
     letter-spacing: 0.02em;

     span {
          color: ${colors.neon};
     }
`

export const Links = styled.nav`
     display: none;

     ${media.tablet} {
          display: flex;
          gap: 0.25rem;
     }
`

export const NavItem = styled(NavLink)`
     position: relative;
     padding: 0.5rem 0.9rem;
     color: ${colors.steel};
     font-weight: 600;
     text-decoration: none;
     transition: color 0.2s ease;

     /* LED chiziq: faol sahifa ostida yonib turadi */
     &::after {
          content: "";
          position: absolute;
          left: 0.9rem;
          right: 0.9rem;
          bottom: 0;
          height: 2px;
          background: ${colors.neon};
          box-shadow: 0 0 8px ${colors.neon}, 0 0 18px ${colors.electric};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
     }

     &:hover {
          color: ${colors.floor};
     }

     &:hover::after {
          transform: scaleX(0.35);
     }

     &.active {
          color: ${colors.floor};
     }

     &.active::after {
          transform: scaleX(1);
     }
`

export const LoginLink = styled(Link)`
     padding: 0.55rem 1.1rem;
     border: 1px solid ${colors.neon};
     border-radius: ${layout.radius};
     color: ${colors.floor};
     font-weight: 600;
     text-decoration: none;
     transition: background-color 0.2s ease, color 0.2s ease;

     &:hover {
          background: ${colors.neon};
          color: ${colors.night};
     }
`

export const Burger = styled.button`
     display: inline-flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     gap: 5px;
     width: 44px;
     height: 44px;
     border: 0;
     background: transparent;
     cursor: pointer;

     ${media.tablet} {
          display: none;
     }

     span {
          display: block;
          width: 22px;
          height: 2px;
          background: ${colors.floor};
          transition: transform 0.25s ease, opacity 0.2s ease;
     }

     ${({ $open }) => $open && css`
          span:nth-child(1) {
               transform: translateY(7px) rotate(45deg);
          }
          span:nth-child(2) {
               opacity: 0;
          }
          span:nth-child(3) {
               transform: translateY(-7px) rotate(-45deg);
          }
     `}
`

export const MobilePanel = styled.nav`
     position: absolute;
     top: 100%;
     left: 0;
     right: 0;
     display: flex;
     flex-direction: column;
     padding: 0.5rem ${layout.gutter} 1rem;
     background: rgba(5, 9, 24, 0.96);
     -webkit-backdrop-filter: blur(14px);
     backdrop-filter: blur(14px);
     border-bottom: 1px solid ${colors.line};

     ${media.tablet} {
          display: none;
     }
`

export const MobileLink = styled(NavLink)`
     padding: 1rem 0;
     border-bottom: 1px solid ${colors.line};
     color: ${colors.steel};
     font-family: ${fonts.heading};
     font-weight: 700;
     font-stretch: 112%;
     font-size: 1.15rem;
     text-decoration: none;

     &:last-child {
          border-bottom: 0;
     }

     &.active {
          color: ${colors.neon};
     }
`