import React from 'react'
import Topbar from '../../layout/Topbar/Topbar'
import "./home.css";
import AllUser from '../../components/ListUsers/AllUser';
import Conge from '../../components/Conge/Conge';

export default function home() {
  return (
    <section className='homes'>
      <Topbar/>
      <AllUser/>
      <Conge/>
    </section>
  )
}
