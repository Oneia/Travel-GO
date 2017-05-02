import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
/**
 * Service for sharing data across the application
 */
@Injectable()
export class ShareDataService {

  public subjects: any = {};

  /**
   * Check if Subject exists and send value to the subscribers
   *
   * @param {string}      subjectId   - Id of subject to be checked and used to send
   * @param {any}         value       - Value to be emitted to the subscribers
   */
  public emitValue(subjectId: string, value: any) {
    this.isSubjectExists(subjectId);
    this.subjects[subjectId].next(value);
  }

  /**
   * Check if Subject exists
   *
   * @param {string}      subjectId   - Id of subject to be checked
   */
  public isSubjectExists(subjectId: string) {
    if (!this.subjects[subjectId]) {
      this.subjects[subjectId] = new Subject();
    }
  }

  /**
   * Subscribe to listen for emitted values
   *
   * @param {string}      subjectId   - Id of subject to be subscribed to
   *
   * @returns {any}
   */
  public trySubject(subjectId: string) {
    this.isSubjectExists(subjectId);
    return this.subjects[subjectId];
  }
}
