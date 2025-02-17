

interface Props {
    popupTitle: string;
}

export default function PopupTitle(props: Props) {
  return (
    <>
      <p class="font-beccaPerry mb-[23px] mobile:text-[25px] text-[30px] text-[#676767] mobile:text-center">
              { props.popupTitle }
      </p>
    </>
  );
}
