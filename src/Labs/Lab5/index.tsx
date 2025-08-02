import { Container } from 'react-bootstrap';
import EnvironmentVariables from './EnvironmentVariables';
import HTTP_SERVER from './EnvironmentVariables';
import PathParameters from './PathParameters';
import QueryParameters from './QueryParameters';
import WorkingWithObjects from './WorkingWithObjects';
import WorkingWithArrays from './WorkingWithArrays';
import WorkingWithArraysAsynchronously from './WorkingWithArraysAsynchronously';
import HttpClient from './HttpClient';
import WorkingWithObjectsAsynchronously from './WorkingWithObjectsAsynchronously';

export default function Lab5() {
  return (
    <Container>
      <div id="wd-lab5">
        <h2>Lab 5</h2>

        <div className="list-group">
          <a href={`${HTTP_SERVER}/lab5/welcome`} className="list-group-item">
            Welcome
          </a>
        </div>
        <hr />
        <EnvironmentVariables />
        <PathParameters />
        <QueryParameters />
        <WorkingWithObjects />
        <WorkingWithArrays />
        <HttpClient />
        <WorkingWithObjectsAsynchronously />
        <WorkingWithArraysAsynchronously />
      </div>
    </Container>
  );
}
