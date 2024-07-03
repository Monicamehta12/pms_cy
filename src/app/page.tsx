import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md"
import Login from "./(auth)/login/page";

export default function Home() {
  return (
    <main>
      <Login></Login>
    </main>
  );
}
