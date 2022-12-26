import React from 'react'

const InputProps = ({target,selectFont,certificateInput,handleInput}) => {
    const title1 = target.split("_")[0]==="user"?"User":"Certificate";
    const title2 = (target.split("_")[1]).toLocaleLowerCase();

    const validKeys = Object.keys(certificateInput).filter(function(key) {
        let st ="";
        for(let i=0; i<target.length;i++){
            st +=key[i];
        }
        return st===target 
    });

  return (
    <div className='d-flex align-items-center justify-content-center border border-2 flex-wrap p-1'>
        <h6 className={`offset-md-1 col-10 m-1 fw-bold`}>{title1} <span className={`text-primary`}>{title2}</span> props</h6>
        <div className={`offset-md-1 col-md-4 col-10 m-1`}>
            <label htmlFor={`${target}_font_size`}>Font Type</label>
            <select name={`${target}_font_type`} value={certificateInput[validKeys[0]]} onChange={handleInput} className={`form-select py-1`} aria-label={`Default select example`}>
                <option className='d-none'>Select One</option>
                {selectFont}
            </select>
            {/*<span className={`text-danger`}>{certificateInput.error_list.target}</span>*/}
        </div>
        <div className={`offset-md-1 col-md-4  col-5  m-1`}>
            <label htmlFor={`${target}_x_position`}> X Position</label>
            <input type={`number`} name={`${target}_x_position`} value={certificateInput[validKeys[3]]} onChange={handleInput} className={`form-control m-0 py-1`} id={`${target}_x_position`} placeholder={``} />
            {/*<span className={`text-danger`}>{certificateInput.error_list.target}</span>*/}
        </div>
        <div className={`offset-md-1 col-md-4  col-5  m-1`}>
            <label htmlFor={`${target}_y_position`}> Y Position</label>
            <input type={`number`} name={`${target}_y_position`} value={certificateInput[validKeys[4]]} onChange={handleInput} className={`form-control m-0 py-1`} id={`${target}_y_position`} placeholder={``} />
            {/*<span className={`text-danger`}>{certificateInput.error_list.target}</span>*/}
        </div>
        <div className={`offset-md-1 col-md-4 col-5  m-1`}>
            <label htmlFor={`${target}_font_size`}> Font Size</label>
            <input type={`number`} name={`${target}_font_size`} value={certificateInput[validKeys[1]]} onChange={handleInput} className={`form-control m-0 py-1`} id={`${target}_font_size`} placeholder={``} />
            {/*<span className={`text-danger`}>{certificateInput.error_list.target}</span>*/}
        </div>
        <div className={`offset-md-1 col-md-4 col-5 m-1`}>
            <label htmlFor={`${target}_font_color`}> Font Color</label>
            <input type={`color`} name={`${target}_font_color`} value={certificateInput[validKeys[2]]} onChange={handleInput} className={`form-control m-0 `} id={`${target}_font_color`} placeholder={``} />
            {/*<span className={`text-danger`}>{certificateInput.error_list.target}</span>*/}
        </div>
    </div>
  )
}

export default InputProps