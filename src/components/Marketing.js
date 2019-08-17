import React, { Component } from 'react';
import { connect} from 'react-redux';
import { debounce, throttle } from 'underscore';

import MediaQuery from 'react-responsive';

import ModalRoot from './ModalRoot';

import { showModal } from '../actions/modals';
import { routeToNode } from '../actions/routing';
import './styles/Marketing.css';

// v2

import NavBar from './v2/components/NavBar';
import Jumbotron from './v2/components/Jumbotron';

const mapDispatchToProps = dispatch => {
	return {
		showModal: (modalType, modalProps) => dispatch(showModal(modalType, modalProps)),
		route: (node) => dispatch(routeToNode(node)),
	}
}


class  Marketing extends Component {
	state = { 
		topOfPage: true,
		activeFeature: null, 
		scrollDir: null,
		scrollHandler: null,
		debounceScroll: null,
	}
	async componentDidMount() {
		console.log(`Mounting Marketing Component - Environment: ${process.env.NODE_ENV}` )
		const scrollHandler = throttle(this.handleScroll, 100)
		const debounceScroll = debounce(this.handleScroll, 100)		
		this.setState({
			scrollHandler,
			debounceScroll
		})
		window.addEventListener('scroll', scrollHandler);
		window.addEventListener('scroll', debounceScroll);

	}

	componentWillUnmount() {
		const  { scrollHandler, debounceScroll } = this.state;
		window.removeEventListener('scroll', scrollHandler)
		window.removeEventListener('scroll', debounceScroll)
	}

	uniqueCollisionFreePrevScrollTop = null

	determineActiveFeature = (viewportCenter, objectOfVerticallyStackedRows) => {
		if (objectOfVerticallyStackedRows.resetter.top > 0 ) {
			this.setState({
				activeFeature: 'none'
			})
		} else {
			Object.keys(objectOfVerticallyStackedRows).forEach(featureKey => {
				const domRECT = objectOfVerticallyStackedRows[featureKey]
				if ((domRECT.top <= viewportCenter) && (domRECT.bottom >= viewportCenter)) return this.setState({
					activeFeature: featureKey
				})
			})
		}
	}

	handleScroll = (event) => {
		let scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
		let viewportCenter = (window.innerHeight / 2)
		const stickyElementRef = (window.innerWidth <= 798) ? this.stickyElMobile : this.stickyEl

		this.determineActiveFeature(viewportCenter, {ft1 : this.ft1.getBoundingClientRect(), ft2: this.ft2.getBoundingClientRect(), ft3: this.ft3.getBoundingClientRect(), ft4: this.ft4.getBoundingClientRect(), resetter: this.resetter.getBoundingClientRect()})

		if (this.uniqueCollisionFreePrevScrollTop && scrollTop > this.uniqueCollisionFreePrevScrollTop && this.state.scrollDir !== 'Scrolling Down') { 
			this.setState({
				scrollDir: 'Scrolling Down'
			})
		}
		if (this.uniqueCollisionFreePrevScrollTop && scrollTop < this.uniqueCollisionFreePrevScrollTop && this.state.scrollDir !== 'Scrolling Up') { 
			this.setState({
				scrollDir: 'Scrolling Up'
			})
		}
		if (!scrollTop && !!window.chrome && !!window.chrome.webstore) {
			scrollTop = event.path[1].scrollY
		}

		if (scrollTop > 0 && this.state.topOfPage === true) {
			this.setState({
				topOfPage: false
			})
		}
		if (scrollTop === 0 && !this.state.topOfPage) {
			this.setState({
				topOfPage: true,
				manageSticky: false
			})
		}

		if ((this.state.activeFeature === 'ft1') || (this.state.activeFeature === 'ft2') || (this.state.activeFeature === 'ft3') || (this.state.activeFeature === 'ft4')) { 
			this.setState({
				manageSticky: true
			})
		} else if (this.stickyElContainer.getBoundingClientRect().top === stickyElementRef.getBoundingClientRect().top && this.state.manageSticky) {
			this.setState({
				manageSticky: false
			})
		}
		// if (this.stickyElContainer.getBoundingClientRect().top === stickyElementRef.getBoundingClientRect().top - 50) is used as a trigger rule
		// It will never be reset properly

		this.uniqueCollisionFreePrevScrollTop = scrollTop
	}

	render(){

    const { 
      topOfPage,
      manageSticky
    } = this.state;
    
    const { 
      route,
      showModal
    } = this.props;

    return(
      <div className='marketing-wrapper'>
        <ModalRoot />
        <div className='screen-resizer'>
        <NavBar
          topOfPage={topOfPage}
          manageSticky={manageSticky}
          route={route}
          showModal={showModal}
        />
        <Jumbotron 
          showModal={showModal}
          route={route}
        />
        </div>
        <div ref={el => this.resetter = el } className='splash-intro'>
          <h2 style={{textAlign: 'center'}}> Payments Made Easy! </h2>
          <p> Omni is an E-Commerce platform aimed at empowering small businesses and individual entrepreneurs by facilitating the ability to easily accept cash and credit card payments. </p>  
        </div>
        <div style={{width: '100%', height: 'auto', backgroundColor: '#AE9DCB'}} ref={el => this.stickyElContainer = el}>
          <MediaQuery minWidth={2} maxWidth={798}>
                      <div className={`icon-revealer-container${(this.state.manageSticky) ? ' shrink-sticky' : ''}`} ref={el => this.stickyElMobile = el}>
                        <div className='icon-revealer-row'>
                          <div style={(this.state.activeFeature === 'ft1') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className='informatic-blurb'>
                            <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/payment-method.svg' />
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Compliant Payments </h4>
                          </div>
                          <div style={(this.state.activeFeature === 'ft2') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className='informatic-blurb'>
                            <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/online-shop.svg' />
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Remote Business Management </h4>
                          </div>
                          <div style={(this.state.activeFeature === 'ft3') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className='informatic-blurb'>
                            <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/stats.svg' />
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}>  Metrics and Statistics  </h4>
                          </div>
                          <div style={(this.state.activeFeature === 'ft4') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className='informatic-blurb-mobile'>
                            <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/smartphone.svg' />
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}>  Personal Marketplace  </h4>
                          </div>
                        </div>
                      </div>
                    </MediaQuery>
                    <MediaQuery minWidth={799}>
                      <div className={`icon-revealer-container${(this.state.manageSticky) ? ' shrink-sticky' : ''}`} ref={el => this.stickyEl = el}>
                <div className='icon-revealer-row'>
                  <div style={(this.state.activeFeature === 'ft1') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co1${(this.state.manageSticky) ? ' co1-move' : ''}`}>
                    <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/payment-method.svg' />
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Compliant Payments </h4>
                    <div className='informatic-blurb__text'>
                    </div>
                  </div>
                  <div style={(this.state.activeFeature === 'ft2') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co2${(this.state.manageSticky) ? ' co2-move' : ''}`}>
                    <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/online-shop.svg' />
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Remote Business Management </h4>
                    <div className='informatic-blurb__text'>
                    </div>
                  </div>
                  <div style={(this.state.activeFeature === 'ft3') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co3${(this.state.manageSticky) ? ' co3-move' : ''}`}>
                    <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/stats.svg' />						
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Metrics and Statistics </h4>
                    <div className='informatic-blurb__text'>
                    </div>
                  </div>
                  <div style={(this.state.activeFeature === 'ft4') ? {animation: 'hoverme 0.8s infinite ease-out'} : {}} className={`informatic-blurb abs-ico-co4${(this.state.manageSticky) ? ' co4-move' : ''}`}>
                    <div className={`informatic-blurb__icon${(this.state.manageSticky) ? ' shrink-icon' : ''}`}>
                      <img alt="" src='/assets/omni-splash/icons/smartphone.svg' />
                    </div>
                    <h4 className={`sticky-headers${(this.state.manageSticky) ? ' sticky-header-shrink' : ''}`}> Personal Marketplace </h4>
                    <div className='informatic-blurb__text'>
                    </div>
                  </div>
                </div>
              </div>
                    </MediaQuery>
          <div className='feature-set-container'>
            <div ref={el => this.ft1 = el } className={`mkt-ft feature-padded-column${(this.state.activeFeature === 'ft1') ? ' activate-feature' : ''}`} >
              <div className={`i1 feature-blurb__image${(window.innerWidth >= 1366) ? ' skewframe' : ''}`}>
                <img alt="" 
                  src={'/assets/pos.jpg'}
                />
              </div>
              <div className='feature-blurb feature-blurb__text'>
                <div className='blurb-center-wrapper'>
                  <h2> Transaction Processing </h2>
                </div>
                <div className='blurb-center-wrapper'>
                  <p> We provide flexible payment solutions for high volume businesses in retail and hospitality. No expensive hardware - our applications are compatible with all devices that can connect to the internet. </p>
                  <p> Sign up for an account to build your store profile and accept payments securely. We utilize <a style={{textDecoration:'none'}}href='https://stripe.com'> Stripe </a> to ensure your information is secure from attackers. We use Stripe to securely process payments from any major credit card provider! </p>
                </div>
              </div>
            </div>
            <div ref={el => this.ft2 = el } className={`mkv-ft feature-padded-column${(this.state.activeFeature === 'ft2') ? ' activate-feature' : ''}`}>
              <div className={`i2 feature-blurb ${(window.innerWidth >= 1366) ? ' skewframe' : ''}`}>
                <img alt="" 
                  src={'/assets/screen-emps.png'} 	
                />
              </div>
              <div className='feature-blurb feature-blurb__text' style={{height: 'auto'}}>
                <div>
                  <h2 style={{padding: '35px 0'}}> Employee Management </h2>
                </div>
                <div>
                  <p> Employee management has never been easier! Keep track of hiring and individual performance with our Admin dashboard. Live feed ensures that you're always kept up-to-date with the minute-to-minute details of running your business without actually having to be there.</p>
                </div>
              </div>
            </div>
              <div ref={el => this.ft3 = el } className={`mkf-ft feature-padded-row reverse${(this.state.activeFeature === 'ft3') ? ' activate-feature' : ''}`} style={{position: 'relative', minHeight: 700}}>
              <div className='i3 feature-blurb__image chart-image skewframe'>
                <img alt="" 
                  src={'/assets/stats.jpg'}
                />
              </div>
              <div className='feature-blurb feature-blurb__text'>
                <div className='blurb-center-wrapper'>
                  <h2> Metrics & Sales Reporting </h2>
                  <p> Evaluate the health of your business with detailed sales reports sent to your account, accessible anywhere. See your top performers, best selling products, and sales trends with the push of a button. Aggregate business performance over time to track gross sales against cost. </p>
                </div>
              </div>
            </div>
            <div ref={el => this.ft4 = el } className={`mkl-ft feature-padded-row${(this.state.activeFeature === 'ft4') ? ' activate-feature' : ''}`} style={{position: 'relative', minHeight: 700}}>
              <div className='i4 feature-blurb feature-blurb__text'>
                <div className='blurb-center-wrapper' style={{padding: 0}}>
                  <h2> Online Marketplace </h2>
                  <p> Sell your stuff online through our marketplace! Connect with other entrepreneurs, find awesome deals, and more! </p>
                  <p> You don't have to be a brick-and-mortar business to take advantage of E-Commerce </p>
                </div>
              </div>
              <div className={`feature-blurb market-image ${(window.innerWidth >= 1366) ? ' skewframe' : ''}`}>	
                <img alt="" 
                  src={'/assets/screen-market.jpg'} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Marketing)