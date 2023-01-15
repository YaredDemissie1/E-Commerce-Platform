import styled from 'styled-components';

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;

  &:focus {
    position: fixed;
    top: 0;
    left: 0;
    width: auto;
    height: auto;
    padding: 1rem;
    background: #007bff;
    color: white;
    z-index: 9999;
  }
`;

export default SkipLink; 