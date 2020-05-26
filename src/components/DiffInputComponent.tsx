import React, { FC, useEffect, useState } from 'react'
import 'bootstrap'
import { DiffInfo } from '../types'

interface DiffInputProps {
  diffInput: string;
  refresh: (s: DiffInfo) => void;
}

const DiffInputComponent: FC<DiffInputProps> = ({
  diffInput,
  refresh,
}: DiffInputProps) => {
  const [textArea, setTextArea] = useState(diffInput)
  const [postData, setPostData] = useState('')

  useEffect(() => {
    fetchDiffInfo()
  }, [postData])

  return (
    <form
      onSubmit={async (event: React.FormEvent) => {
        await submitDiffInputText(event, textArea)
      }}
    >
      <div className="form-group">
        <textarea
          className="form-control"
          rows={10}
          value={textArea}
          onChange={(event) => {
            setTextArea(event.target.value)
          }}
        />
      </div>
      <div className="form-group">
        <input className="form-control" type="submit" value="Submit" />
      </div>
    </form>
  )

  function fetchDiffInfo () {
    fetch(
      'http://simple-ci.com:8080/build?image=scottg489/diff-info:latest&pull=\n' +
      'false',
      {
        method: 'POST',
        body: postData,
      },
    )
      .then(async (response) => {
        const diffInfo: DiffInfo = await response.json()
        refresh(diffInfo)
      })
      .catch((reason) => console.log('Failure reason: ' + reason))
  }

  function submitDiffInputText (
    event: React.FormEvent,
    input: string,
  ) {
    event.preventDefault()
    setPostData(input)
  }
}

export default DiffInputComponent
