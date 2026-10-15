import { useState } from "react";
import { UIContext } from "./UIContext";

export function UIProvider({children}){

  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [openRlcBar, setRlcBar] = useState(false);

  const [bagLength, setBagLength] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const [productsData, setProductsData] = useState([]);
 

  const handleSearchToggle = () => {
    setOpenSearchBar((prevUI) => !prevUI);
    setRlcBar(false);

  }
  const handleBarToggle = () => {
    setRlcBar((prevUI) => !prevUI);
    setOpenSearchBar(false);
   
  }



  const [searchedData, setSearchedData] = useState([]);
  const [freezeST,setFreezeST] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

 

  const [addedToFav, setAddedToFav] = useState([]);
  const [guestFavData, setGuestFavData] = useState([]);
  const [bagProducts, setBagProducts] = useState([]);
  const [checkoutProducts ,setCheckoutProducts] = useState([]);





 



  const totalPrice = bagProducts.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
   const [completeLookOpen, setCompleteLookOpen] = useState(false);
  return(
    <UIContext.Provider value={{openSearchBar,setOpenSearchBar, openRlcBar, handleSearchToggle, handleBarToggle,searchedData, setSearchedData, setFreezeST, freezeST,isLoading, setIsLoading, addedToFav, setAddedToFav, guestFavData, setGuestFavData, bagProducts, setBagProducts, totalPrice, checkoutProducts, setCheckoutProducts,bagLength, setBagLength,searchTerm, setSearchTerm,productsData, setProductsData,completeLookOpen, setCompleteLookOpen}}>
      {children}
    </UIContext.Provider>
  )
}