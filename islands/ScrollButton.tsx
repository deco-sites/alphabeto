import { useEffect, useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";

export default function ScrollButton() {
  const [isVisible, setisVisible] = useState(false)

  useEffect(() => {
    const activateButton = () => {
      if (window.scrollY > 375) {
        setisVisible(true)
      } else {
        setisVisible(false)
      }
    }

    self.addEventListener('scroll', activateButton)
    return () => removeEventListener('scroll', activateButton)
  }, [])

  const scroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {isVisible &&
        <button class="fixed z-10 top-[80%] right-[40px] w-[40px] h-[40px] rounded-[50%] bg-[#D6DE23] border-0 p-[8px]" onClick={scroll}><Icon id="chevron-up" /></button>
      }
    </div>
  )
}