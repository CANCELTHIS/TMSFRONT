import React from 'react'

const Hero3 = () => {
  return (
    <div className="container px-5">
        <div className="circle1"></div>
        <h2 className="d-flex justify-content-center mb-4" id="texthero2">Why TMS</h2>
        <div className="row d-flex justify-content-between gap-4">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4">
                <div className="card text-center" style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}>
                    <div className="card-body">
                        <h5 className="card-title">Optimize Fleet Utilization</h5>
                        <p className="card-text">
                            Maximize vehicle usage with centralized scheduling, real-time tracking, and improved management.
                        </p>
                    </div>
                </div>
            </div>
            <div className="circle2"></div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4" style={{ marginTop: '100px' }}>'
                <div className="card text-center" style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}>
                    <div className="card-body">
                    
                        <h5 className="card-title">Enhance Operational Efficiency</h5>
                        <p className="card-text">
                            Reduce time spent on administrative tasks through automated workflows and streamlined approvals.
                        </p>
                    </div>
                </div>
            </div>
        </div>  
        <div className="circle3"></div>    
        <div className="row d-flex justify-content-between gap-4">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4">
                <div className="card text-center" style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}>
                    <div className="card-body">
                        <h5 className="card-title">Reduce Costs</h5>
                        <p className="card-text">
                            Lower operational expenses with advanced data analysis and preventive maintenance scheduling to avoid unexpected repairs and downtime.
                        </p>
                    </div>
                </div>
            </div>
            <div className="circle4"></div>  
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4" style={{ marginTop: '100px' }}>
                <div className="card text-center" style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}>
                    <div className="card-body">
                        <h5 className="card-title">Optimize Fleet Utilization</h5>
                        <p className="card-text">
                            Maximize vehicle usage with centralized scheduling, real-time tracking, and improved management.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Hero3;
