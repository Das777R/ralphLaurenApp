import './HomePageFooter.css'

function HomePageFooter() {
  return (
     <footer className="d-flex flex-column bg-body">
          <div className="signup-to-rlc-section sign-to-rlc-only-1024 footer-con d-xxl-none d-xl-none">
          <div className="for-rlc-message-signup-1024 d-lg-flex">
          <div className="signup-to-rlc-message text-uppercase  fw-medium">Sign up to receive the latest news, special offers and/or exclusive events relating to Ralph Lauren products and services, by e-mail or targeted social media ads. By signing up, you consent to the use of tracking technologies for personalisation and analytics.</div>
        <div className="signup-to-rlc-container mt-3 mb-4">
          <input type="text" className="signup-input-rlf" placeholder="ENTER YOUR EMAIL ADDRESS"/>
          <button className="submit-to-rlcf text-uppercase">submit</button>
        </div>
            </div>
        <div className="signup-to-rlc-privacy">
          You may unsubscribe at any time by clicking on the unsubscribe link in each e-mail. For more information, please read Ralph Lauren Europe Sàrl’s <span className="text-decoration-underline">Privacy Policy</span>.
        </div>
         </div>
      <div className="rlc-footer-container d-flex gap-1">
        <div className="footer-con footer-con-about">
        <div className="rlc-about-section">
        <div className="about-section-title text-uppercase fw-medium">about</div>
        <div className="about-section-nav text-capitalize">about us</div>
        <div className="about-section-nav text-capitalize">carrers</div>
        <div className="about-section-nav text-capitalize">world of RL</div>
        <div className="about-section-nav text-capitalize">protecting our brands</div>
        <div className="about-section-nav text-capitalize">privacy</div>
        <div className="about-section-nav text-capitalize">terms of use</div>
        <div className="about-section-nav text-capitalize">terms of sale</div>
        <div className="about-section-nav text-capitalize">imprint</div>
        <div className="about-section-nav text-capitalize">cookies</div>
        <div className="about-section-nav text-capitalize">manage cookies settings</div>
        <div className="about-section-nav text-capitalize">accessibility statement</div>
        </div>
  
      </div>

      <div className="footer-con">
        <div className="rlc-account-section">
          <div className="account-section-title text-uppercase  fw-medium">account</div>
          <div className="account-section-nav text-capitalize">my account</div>
          <div className="account-section-nav text-capitalize">check order</div>
        </div>

      </div>

      <div className="footer-con">
        <div className="rlc-customer-service-section">
        <div className="customer-service-title text-uppercase  fw-medium">customer service</div>
        <div className="customer-service-nav text-capitalize">help</div>
        <div className="customer-service-nav text-capitalize">shipping</div>
        <div className="customer-service-nav text-capitalize">free online returns</div>
        <div className="customer-service-nav text-capitalize">operating guidelines</div>
        <div className="customer-service-nav text-capitalize">sitemap</div>
        </div>
      </div>

      <div className="signup-to-rlc-section footer-con">
        <div className="signup-to-rlc-message text-uppercase  fw-medium">Sign up to receive the latest news, special offers and/or exclusive events relating to Ralph Lauren products and services, by e-mail or targeted social media ads. By signing up, you consent to the use of tracking technologies for personalisation and analytics.</div>
        <div className="signup-to-rlc-container mt-3 mb-4">
          <input type="text" className="signup-input-rlf" placeholder="ENTER YOUR EMAIL ADDRESS"/>
          <button className="submit-to-rlcf text-uppercase">submit</button>
        </div>
        <div className="signup-to-rlc-privacy">
          You may unsubscribe at any time by clicking on the unsubscribe link in each e-mail. For more information, please read Ralph Lauren Europe Sàrl’s <span className="text-decoration-underline">Privacy Policy</span>.
        </div>
      </div>
      </div>

     <div className="rlc-social-media-container w-100">
      <div className="rlc-social-media d-flex mt-5 justify-content-center gap-4">
        <div className="rlc-instagram rlc-socials">
          <i className="fa-brands fa-instagram"></i>
        </div>
        <div className="rlc-facebook rlc-socials">
          <i className="fa-brands fa-square-facebook"></i>
        </div>
        <div className="rlc-yt rlc-socials">
          <i className="fa-brands fa-square-youtube"></i>
        </div>
        <div className="rlc-x rlc-socials">
          <i className="fa-brands fa-square-x-twitter"></i>
        </div>

        <div className="rlc-pinterest rlc-socials">
          <i className="fa-brands fa-square-pinterest"></i>
        </div>
        
      </div>
      <div className="rlc-copyright text-capitalize text-center mt-4">
        © Copyright 2026 Ralph Lauren Media LLC
      </div>
     </div>
     </footer>
  )
}

export default HomePageFooter
